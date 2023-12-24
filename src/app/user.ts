export interface User {
  id: string,
  username: string,
  age: number,
  gender: string,
  maritalStatus: string,
  country: {
    id: string,
    value: string
  }
}
