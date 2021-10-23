interface IDateProvider {
  compareInHours(startDate: Date, endDate: Date): number;
  compareInDays(startDate: Date, endDate: Date): number;
  convertToUTC(date: Date): string;
  addDays(days: number): Date;
}
export { IDateProvider };
