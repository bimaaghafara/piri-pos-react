export class MBVariable {
  id: string;
  appId: string;
  value: any;
  variableGroup: string;
}

export class MAppVariable extends MBVariable { }

export class UserVariable extends MBVariable {
  userId: string;
}