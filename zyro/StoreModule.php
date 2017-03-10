<?php

/**
 * Description of StoreModule
 */
class StoreModule {
	
	private static $logFileRenewed = false;
	
	private static function renewLogFile() {
		if (self::$logFileRenewed) return;
		$log = dirname(__FILE__).'/store.log';
		if ($log && is_file($log)) {
			$orders = json_decode(file_get_contents($log), true);
			if (is_null($orders) || $orders === false) { // not json script
				$orders = array('complete' => array());
				if (($fh = @fopen($log, 'r'))) {
					while (!feof($fh)) {
						$line = fgets($fh);
						if (!$line) continue;
						$orders['complete'][] = json_decode($line, true);
					}
					fclose($fh);
				}
				file_put_contents($log, json_encode($orders));
				self::$logFileRenewed = true;
			}
		}
	}
	
	public static function getLogFile() {
		self::renewLogFile(); // TODO: delete after some time
		$log = dirname(__FILE__).'/store.log';
		if (!is_file($log)) file_put_contents($log, '');
		return $log;
	}
	
	/**
	 * Add order to log
	 * @param array $order order details
	 * @param boolean $pending if true add to pending list
	 */
	private static function logAddOrder($order, $pending = false) {
		$log = self::getLogFile();
		if ($log) {
			$orders = json_decode(file_get_contents($log), true);
			$location = ($pending ? 'pending' : 'complete');
			if (!isset($orders[$location])) $orders[$location] = array();
			$orders[$location][] = $order;
			file_put_contents($log, json_encode($orders));
			return true;
		}
		return false;
	}
	
	/**
	 * Get all complete orders list
	 */
	private static function logGetCompleteOrders() {
		$log = self::getLogFile();
		if ($log) {
			$orders = json_decode(file_get_contents($log), true);
			if (isset($orders['complete'])) {
				return $orders['complete'];
			}
		}
		return null;
	}
	
	/**
	 * Get pending order by transaction ID
	 * @param string $tnxId transaction ID
	 */
	private static function logGetPendingOrder($tnxId) {
		$log = self::getLogFile();
		if ($log) {
			$orders = json_decode(file_get_contents($log), true);
			if (isset($orders['pending'])) {
				foreach ($orders['pending'] as $ord) {
					if (isset($ord['tnx_id']) && $ord['tnx_id'] == $tnxId) {
						return $ord;
					}
				}
			}
		}
		return null;
	}
	
	/**
	 * Moves pending order to complete list
	 * @param array $order order details
	 */
	private static function logCompleteOrder($order) {
		$log = self::getLogFile();
		if ($log) {
			$orders = json_decode(file_get_contents($log), true);
			if (isset($orders['pending'])) {
				foreach ($orders['pending'] as $idx => $ord) {
					if (isset($ord['tnx_id']) && $ord['tnx_id'] == $order['tnx_id']) {
						$order['time'] = date('Y-m-d H:i:s');
						unset($order['tnx_id']);
						unset($orders['pending'][$idx]);
						$orders['complete'][] = $order;
						file_put_contents($log, json_encode($orders));
						return true;
					}
				}
			}
		}
		return false;
	}
	
	/**
	 * Parse request to perform special actions
	 * @global int $home_page home page id
	 * @param array $page page definition as key value pair array
	 * @param string $lang current page language code
	 * @param string $urlArgs additional url arguments
	 */
	public static function parseRequest($page, $lang, $urlArgs) {
		global $home_page;
		$key = reset($urlArgs);
		if ($page['id'] == $home_page && $key == 'store-log') {
			header('Access-Control-Allow-Origin: *', true); // allow cross domain requests
			header('Content-Type: application/json; charset=utf-8', true);
			echo json_encode(self::logGetCompleteOrders());
			exit();
		} else if ($page['id'] == $home_page && $key == 'store-callback' && isset($_GET['gatewayId']) && ($gatewayId = $_GET['gatewayId'])) {
			self::gatewayCallback($gatewayId);
			exit(0);
		} else if ($page['id'] == $home_page && $key == 'store-save-order') {
			$data = array(
				'time' => date('Y-m-d H:i:s'),
				'tnx_id' => (isset($_POST['tnx_id']) && $_POST['tnx_id']) ? $_POST['tnx_id'] : null,
				'gateway_id' => (isset($_POST['gateway_id']) && $_POST['gateway_id']) ? $_POST['gateway_id'] : null,
				'buyer' => null,
				'order' => (isset($_POST['order']) && $_POST['order']) ? array_map('trim', $_POST['order']) : null,
				'price' => (isset($_POST['price']) && $_POST['price']) ? $_POST['price'] : null,
				'type' => 'buy'
			);
			self::logAddOrder($data, true);
			exit();
		}
	}
	
	/**
	 * Callback function to complete payment from payment system
	 * @param string $gatewayId payment gateway ID
	 */
	private static function gatewayCallback($gatewayId) {
		$tnxId = null; $order = null;
		file_put_contents(dirname(__FILE__).'/store_orders.log', print_r(array($gatewayId, $_POST), true), FILE_APPEND);
		if ($gatewayId == 'Paypal') {
			$tnxId = (isset($_POST['custom']) && $_POST['custom']) ? $_POST['custom'] : null;
		} else if ($gatewayId == 'Skrill') {
			$tnxId = (isset($_POST['transaction_id']) && $_POST['transaction_id']) ? $_POST['transaction_id'] : null;
		} else if ($gatewayId == 'Webmoney') {
			$txnId = (isset($_POST['TRANSACTION_ID']) && $_POST['TRANSACTION_ID']) ? $_POST['TRANSACTION_ID'] : null;
		}
		if ($tnxId) {
			$order = self::logGetPendingOrder($tnxId);
			if ($order) {
				$buyer = null;
				if ($gatewayId == 'Paypal') {
					$address = array();
					$address[] = (isset($_POST['address_street']) && $_POST['address_street']) ? $_POST['address_street'] : '';
					$address[] = (isset($_POST['address_city']) && $_POST['address_city']) ? $_POST['address_city'] : '';
					$address[] = (isset($_POST['address_country']) && $_POST['address_country']) ? $_POST['address_country'] : '';
					$address = implode(', ', $address);
					$buyer = array(
						'Name' => (isset($_POST['address_name']) && $_POST['address_name']) ? $_POST['address_name'] : null,
						'E-Mail' => (isset($_POST['receiver_email']) && $_POST['receiver_email']) ? $_POST['receiver_email'] : null,
						'Address' => ($address ? $address : null),
						'Payed' => $gatewayId
					);
				} else if ($gatewayId == 'Skrill') {
					
				} else if ($gatewayId == 'Webmoney') {
					
				}
				$order['buyer'] = $buyer;
				self::logCompleteOrder($order);
			}
		}
	}
	
	/**
	 * Parse form object data string
	 * @param array $formDef form definition (associative array)
	 * @return stdClass
	 */
	private static function parseFormObject($formDef) {
		$obj = ((isset($formDef['object']) && $formDef['object']) ? json_decode($formDef['object']) : null);
		if (!$obj || !is_object($obj)) $obj = null;
		return $obj;
	}
	
	/**
	 * Render form object data
	 * @param array $formDef form definition (associative array)
	 * @param array $formData form data (input by user)
	 * @return string
	 */
	public static function renderFormObject($formDef, $formData) {
		$obj = self::parseFormObject($formDef);
		$objData = self::parseFormObject($formData);
		if (isset($obj->name) && $obj->name && $objData && isset($objData->items) && is_array($objData->items) && !empty($objData->items)) {
			$return = '<p><strong>';
			foreach ($objData->items as $item) {
				$return .= str_replace(
						array('{{name}}', '{{sku}}', '{{price}}', '{{qty}}'),
						array($item->name, $item->sku, $item->price, $item->qty),
						$obj->name
					).'<br />';
			}
			$return .= '</strong></p>';
			return $return;
		} else {
			return (isset($obj->name) && $obj->name) ? '<p><strong>'.htmlspecialchars($obj->name).'</strong></p>' : '';
		}
	}
	
	/**
	 * Log sent form as store order
	 * @param array $formDef form definition (associative array)
	 * @param array $formData form data (input by user)
	 */
	public static function logForm($formDef, $formData) {
		$buyer = array();
		foreach ($formDef['fields'] as $idx => $field) {
			$buyer[tr_($field['name'])] = $formData[$idx];
		}
		$obj = self::parseFormObject($formDef);
		$objData = self::parseFormObject($formData);
		$order = null; $price = null;
		if ($objData) {
			if (isset($objData->items) && is_array($objData->items) && !empty($objData->items)) {
				foreach ($objData->items as $item) {
					$order[] = str_replace(
							array('{{name}}', '{{sku}}', '{{price}}', '{{qty}}'),
							array($item->name, $item->sku, $item->price, $item->qty),
							$obj->name
						);
				}
			}
			$price = (isset($objData->totalPrice) && $objData->totalPrice) ? $objData->totalPrice : null;
		} else {
			$order = (isset($obj->name) && $obj->name) ? $obj->name : null;
			$price = (isset($obj->price) && $obj->price) ? $obj->price : null;
		}
		$data = array(
			'time' => date('Y-m-d H:i:s'),
			'buyer' => (empty($buyer) ? null : $buyer),
			'order' => $order,
			'price' => $price,
			'type' => 'inquiry'
		);
		self::logAddOrder($data);
	}
	
}
