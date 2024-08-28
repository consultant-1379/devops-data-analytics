import { App } from "./app.interface";
import { DeliveryCell, PassrateCell } from "./cell.interface";

export interface AppRowData {
    application: App;
    asDeliveriesY: DeliveryCell;
    asDeliveries20: DeliveryCell;
    asPassrateY: PassrateCell;
    asPassrate20: PassrateCell;
    psDeliveriesY: DeliveryCell;
    psDeliveries20: DeliveryCell;
    psPassrateY: PassrateCell;
    psPassrate20: PassrateCell;
}
