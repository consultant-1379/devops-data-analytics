import { Observable } from "rxjs";
import { GridTile } from "./grid-tile";

export interface GridParent{
    rowHeight: string,
    tiles: Observable<GridTile[]>
}