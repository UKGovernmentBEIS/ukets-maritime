import {
  CardPaymentCreateResponseDTO,
  CardPaymentProcessResponseDTO,
  PaymentMakeRequestTaskPayload,
  PaymentProcessedRequestActionPayload,
} from '@mrtm/api';

export type PaymentTaskPayload = PaymentMakeRequestTaskPayload &
  PaymentProcessedRequestActionPayload &
  CardPaymentCreateResponseDTO &
  CardPaymentProcessResponseDTO;
