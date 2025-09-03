import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'peerReviewDecision', standalone: true })
export class PeerReviewDecisionPipe implements PipeTransform {
  transform(decision: 'AGREE' | 'DISAGREE' | boolean): string {
    switch (decision) {
      case 'AGREE':
      case true:
        return 'I agree with the determination';
      case 'DISAGREE':
      case false:
        return 'I do not agree with the determination';
      default:
        return '';
    }
  }
}
