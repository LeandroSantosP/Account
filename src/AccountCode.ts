export class AccountCode {
  value: string;
  constructor(account_date: Date, sequence: number) {
    const year = account_date.getFullYear();
    this.value = `${year}${sequence.toString().padStart(8, "0")}`;
  }
}
