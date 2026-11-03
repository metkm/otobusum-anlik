export type Time = `${number}:${number}:${number}`

export interface Timetable {
  sunday: Time[]
  monday: Time[]
  tuesday: Time[]
  wednesday: Time[]
  thursday: Time[]
  friday: Time[]
  saturday: Time[]
}
