import { context, u128, PersistentVector } from "near-sdk-as";

@nearBindgen
export class Entity {
  public name: string;
  constructor(name: string) {
    this.name = name;
  }
}

@nearBindgen
export class Certificate {
  private _name: string;
  private signed: bool;
  private signedBy: Map<Entity, bool>;
  private maxEntities: 4;

  constructor(
    name: string,
    signed: bool = false, 
    signedBy: Map<Entity, bool> = new Map(),
    ) {
    this._name = name;
    this.signed = signed;
    this.signedBy = signedBy;
  }

  addCertificator(entity: Entity): void {
    if (this.signed) return;
    this.signedBy.set(entity, true);
    if (this.signedBy.size <= this.maxEntities) {
      this.signed = true
      // GENERATE NFT
    }
  }

  public get isSigned(): bool {
    return this.signed;
  }

  public get name(){
    return this._name;
  }
}

export const certificates = new PersistentVector<Certificate>("m");
export const signedCertificates = new PersistentVector<Certificate>("m");
export const entities = new PersistentVector<Entity>("m");