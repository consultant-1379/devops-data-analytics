import { App } from "./app.interface";
import { CFRCell, DeliveryCell, LTCCell } from "./cell.interface";

export interface AppRowData {
    application: App;
    asDeliveriesY: DeliveryCell;
    asDeliveries20: DeliveryCell;
    asCFRY: CFRCell;
    asCFR20: CFRCell;
    psDeliveriesY: DeliveryCell;
    psDeliveries20: DeliveryCell;
    psCFRY: CFRCell;
    psCFR20: CFRCell;
    asLTC20: LTCCell;
    psLTC20: LTCCell;
}
