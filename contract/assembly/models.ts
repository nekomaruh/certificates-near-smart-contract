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
  private signedBy: Entity[];
  private maxEntities: number;

  constructor(
    name: string,
    signed: bool = false, 
    signedBy: Entity[] = [],
    ) {
    this._name = name;
    this.signed = signed;
    this.signedBy = signedBy;
    this.maxEntities = 4;
  }

  addCertificator(entity: Entity): void {
    if (this.signed) return;
    //this.signedBy.set(entity, true);
    this.signedBy.push(entity);
    if (this.signedBy.length <= this.maxEntities) {
      this.signed = true
      // GENERATE NFT
    }
  }

  public get isSigned(): bool {
    return this.signed;
  }

  public get name(): string{
    return this._name;
  }
}

export const certificates = new PersistentVector<Certificate>("m");
export const signedCertificates = new PersistentVector<Certificate>("m");
export const entities = new PersistentVector<Entity>("m");