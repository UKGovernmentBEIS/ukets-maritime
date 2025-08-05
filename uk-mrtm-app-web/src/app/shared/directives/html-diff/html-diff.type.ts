export interface Operation {
  action: 'equal' | 'insert' | 'delete' | 'replace';
  startInBefore: number;
  endInBefore: number;
  startInAfter: number;
  endInAfter: number;
}

export type OperationMap = {
  [key in Operation['action']]?: (op: Operation, beforeTokens: string[], afterTokens: string[]) => string;
};

export class Match {
  startInBefore: number;
  startInAfter: number;
  length: number;
  endInBefore: number;
  endInAfter: number;

  constructor(startInBefore: number, startInAfter: number, length: number) {
    this.startInBefore = startInBefore;
    this.startInAfter = startInAfter;
    this.length = length;
    this.endInBefore = this.startInBefore + this.length - 1;
    this.endInAfter = this.startInAfter + this.length - 1;
  }
}
