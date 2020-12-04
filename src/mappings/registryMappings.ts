import { BigInt } from "@graphprotocol/graph-ts";
import {
  NewRelease as NewReleaseEvent,
  NewVault as NewVaultEvent,
  NewExperimentalVault as NewExperimentalVaultEvent,
} from "../../generated/Registry/Registry";
import { createEthTransaction } from "../utils/commons";
import { createVault, releaseVault } from "../utils/registry-commons";

export function handleNewRelease(event: NewReleaseEvent): void {
  releaseVault(
    event.params.template,
    event.params.api_version,
    event.params.event_id,
    event
  )
}

export function handleNewVault(event: NewVaultEvent): void {
  let ethTransaction = createEthTransaction(event, "NewVaultEvent");

  createVault(
    ethTransaction.id,
    event.params.vault,
    "Endorsed",
    event.params.api_version,
    event.params.event_id,
    event.params.token,
    event,
  )
}

export function handleNewExperimentalVault(event: NewExperimentalVaultEvent): void {
  let ethTransaction = createEthTransaction(event, "NewVaultEvent");

  createVault(
    ethTransaction.id,
    event.params.vault,
    "Experimental",
    event.params.api_version,
    BigInt.fromI32(-1),
    event.params.token,
    event,
  )
}