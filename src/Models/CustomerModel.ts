import { MFile } from './FileModel';

export class MCustomer {
  id: string;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumberCountryId: string;
  nationalPhoneNumber: string;
  phoneNumber: string;
  locationCityId: string;
  locationCountryId: string;
  pictureId: string;
  walletBalance: number;
  picture: MFile;
}
