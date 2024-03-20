import { NextResponse } from 'next/server';

type HandlerErrorProperties = {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  [extension: string]: any;
};

export default class HandlerError {
  constructor(public readonly properties: HandlerErrorProperties = {}) {
    if (this.properties.title === undefined) {
      this.properties.title = 'Internal server error';
    }

    if (this.properties.status === undefined) {
      this.properties.status = 500;
    }
  }

  public response() {
    return new NextResponse(this.properties.title, { status: this.properties.status });
  }

  public jsonResponse() {
    return NextResponse.json(this.properties, {
      status: this.properties.status,
      headers: { 'Content-Type': 'application/problem+json' },
    });
  }
}
