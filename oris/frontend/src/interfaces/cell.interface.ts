import { EitherOf } from "src/types/custom-types.type";

export interface DeliveryCell {
  totalDeliveries: EitherOf;
  successfulDeliveries: EitherOf;
  failedDeliveries: EitherOf;
  class: string;
}

export interface CFRCell {
  cfr: string;
  class: string;
}

export interface LTCCell {
  ltc: string;
  class: string;
  type: 'total' | 'normal'
}