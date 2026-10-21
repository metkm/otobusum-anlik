export interface StopArrival {
  stop_order: number
  stop_code: number
  door_no: string
  garage: string
  line_code: string
  lat: number
  lng: number
  last_speed: number
  arrival_time: string
  minutes_left: number
  line_name: string
  last_location_time: string
  route_code: string
  stop_name: string
  features: {
    accessible: boolean
    usb_available: boolean
    wifi_available: boolean
    ac_active: boolean
    bicycle_rack: boolean
  }
}

// #[derive(Serialize, Deserialize)]
// Pub struct StopArrival {
//     Stop_order: u32,
//     Stop_code: u32,
//     Door_no: String,
//     Garage: String,
//     Line_code: String,
//     Lat: f64,
//     Lng: f64,
//     Last_speed: u8,
//     Arrival_time: String,
//     Minutes_left: u16,
//     Line_name: String,
//     Last_location_time: String,
//     Route_code: String,
//     Stop_name: String,
//     Features: BusFeatures,
// }

// #[derive(Serialize, Deserialize)]
// Struct BusFeatures {
//     Accessible: bool,
//     Usb_available: bool,
//     Wifi_avalable: bool,
//     Ac_active: bool,
//     Bicycle_rack: bool,
// }
