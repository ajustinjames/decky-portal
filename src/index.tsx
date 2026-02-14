import merge from 'lodash/merge'
import { FaTv } from "react-icons/fa";
import { StateManager } from "cotton-box";
import { quickAccessMenuClasses } from "@decky/ui";
import { definePlugin, routerHook, } from "@decky/api";

import { PipOuter } from "./pip";
import { Settings } from "./settings";
import { Position, ViewMode } from "./util";
import { State, GlobalContext } from "./globalState";

export default definePlugin(() => {
    const state = new StateManager<State>(merge<Partial<State>, State, Partial<State>>(
        {},
        {
            viewMode: ViewMode.Closed,
            visible: true,
            position: Position.TopRight,
            margin: 30,
            size: 1,
            url: "https://netflix.com"
        },
        JSON.parse(localStorage.getItem('pip') ?? '{}')));

    state.watch(({ position, margin, size, url }) =>
        localStorage.setItem('pip', JSON.stringify({ position, margin, size, url })));

    routerHook.addGlobalComponent("Portal", () => {
        return <GlobalContext.Provider value={state}>
            <PipOuter />
        </GlobalContext.Provider>
    });

    return {
        name: "Portal",
        titleView: <div className={quickAccessMenuClasses.Title}>Portal</div>,
        icon: <FaTv />,
        content:
            <GlobalContext.Provider value={state}>
                <Settings />
            </GlobalContext.Provider>,
        onDismount() {
            routerHook.removeGlobalComponent("Portal");
        },
    };
});
