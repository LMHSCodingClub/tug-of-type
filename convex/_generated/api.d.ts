/* eslint-disable */
/**
 * Generated API.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@0.6.0.
 * To regenerate, run `npx convex codegen`.
 * @module
 */

import type { ApiFromModules } from "convex/api";
import type * as createRace from "../createRace";
import type * as createText from "../createText";
import type * as decrementTimer from "../decrementTimer";
import type * as editUser from "../editUser";
import type * as endRace from "../endRace";
import type * as getCounter from "../getCounter";
import type * as incrementCounter from "../incrementCounter";
import type * as joinRace from "../joinRace";
import type * as listBestScores from "../listBestScores";
import type * as listRaces from "../listRaces";
import type * as listTexts from "../listTexts";
import type * as readRace from "../readRace";
import type * as storeUser from "../storeUser";

/**
 * A type describing your app's public Convex API.
 *
 * This `API` type includes information about the arguments and return
 * types of your app's query and mutation functions.
 *
 * This type should be used with type-parameterized classes like
 * `ConvexReactClient` to create app-specific types.
 */
export type API = ApiFromModules<{
  createRace: typeof createRace;
  createText: typeof createText;
  decrementTimer: typeof decrementTimer;
  editUser: typeof editUser;
  endRace: typeof endRace;
  getCounter: typeof getCounter;
  incrementCounter: typeof incrementCounter;
  joinRace: typeof joinRace;
  listBestScores: typeof listBestScores;
  listRaces: typeof listRaces;
  listTexts: typeof listTexts;
  readRace: typeof readRace;
  storeUser: typeof storeUser;
}>;
