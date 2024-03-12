import { NextResponse } from 'next/server';

export default class HandlerError {
  constructor(public readonly message: string = 'Internal server error', public readonly statusCode: number = 500) {}

  public response() {
    return new NextResponse(this.message, { status: this.statusCode });
  }

  public jsonResponse() {
    return NextResponse.json({ message: this.message }, { status: this.statusCode });
  }
}
