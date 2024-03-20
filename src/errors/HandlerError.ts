import { NextResponse } from 'next/server';

type ErrorParams = {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  [extension: string]: any;
};

export default class HandlerError {
  constructor(public readonly params: ErrorParams) {
    if (this.params.title === undefined) {
      this.params.title = 'Internal server error';
    }

    if (this.params.status === undefined) {
      this.params.status = 500;
    }
  }

  public response() {
    return new NextResponse(this.params.title, { status: this.params.status });
  }

  public jsonResponse() {
    return NextResponse.json(this.params, {
      status: this.params.status,
      headers: { 'Content-Type': 'application/problem+json' },
    });
  }
}
