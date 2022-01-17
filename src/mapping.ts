import { BigInt } from "@graphprotocol/graph-ts"
import {
  GrantCreated,
  GrantFulfilled,
  GrantUpdated
} from "../generated/GrantManager/GrantManager"
import { Grant, GrantCount } from "../generated/schema"

export function handleGrantCreated(event: GrantCreated): void {
  let grant = Grant.load(event.params.id.toString())
  let grantCount = GrantCount.load("0")

  if (!grantCount) {
    grantCount = new GrantCount("0")
    grantCount.count = BigInt.fromI32(0)
  }

  if (!grant) {
    grant = new Grant(event.params.id.toString())
  }

  grant.amount = event.params.amount
  grant.owner = event.params.owner
  grant.data = event.params.metaPtr.at(1).toString()
  grant.save()

  grantCount.count = grantCount.count.plus(BigInt.fromI32(1));
  grantCount.save()
}

export function handleGrantFulfilled(event: GrantFulfilled): void {
  let entity = Grant.load(event.params.id.toString())
  if (!entity) return

  entity.payee = event.params.payee
  entity.save()
}

export function handleGrantUpdated(event: GrantUpdated): void {
  let entity = Grant.load(event.params.id.toString())
  if (!entity) return

  entity.owner = event.params.owner
  entity.data = event.params.metaPtr.at(1).toString()
  entity.save()  
}
