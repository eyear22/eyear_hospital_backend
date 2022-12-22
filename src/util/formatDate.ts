export class FormatDate {
  static formatDate(data: Date): string {
    const temp = data.toISOString().split('T')[0];
    const temp2 = temp.split('-');

    return temp2[0].substring(2) + '/' + temp2[1] + '/' + temp2[2];
  }
}
