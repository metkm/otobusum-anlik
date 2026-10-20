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
// pub struct StopArrival {
//     stop_order: u32,
//     stop_code: u32,
//     door_no: String,
//     garage: String,
//     line_code: String,
//     lat: f64,
//     lng: f64,
//     last_speed: u8,
//     arrival_time: String,
//     minutes_left: u16,
//     line_name: String,
//     last_location_time: String,
//     route_code: String,
//     stop_name: String,
//     features: BusFeatures,
// }

// #[derive(Serialize, Deserialize)]
// struct BusFeatures {
//     accessible: bool,
//     usb_available: bool,
//     wifi_avalable: bool,
//     ac_active: bool,
//     bicycle_rack: bool,
// }
