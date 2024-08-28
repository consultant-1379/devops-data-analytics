import { BuildsState } from "src/enum/build-state";

export interface GridTile{
    title: string,
    buildsCount?: number,
    buildsState?: BuildsState,
    cols: number,
    rows: number,
    component: any
}
