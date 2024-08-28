import { EitherOf } from "../types/custom-types.type";

export interface DeliveryCell {
  totalDeliveries: EitherOf;
  successfulDeliveries: EitherOf;
  failedDeliveries: EitherOf;
  class: string;
}

export interface PassrateCell {
  passRate: string;
  class: string;
}