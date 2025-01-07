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
    if (this.properties.status === undefined) {
      this.properties.title = 'Internal server error';
      this.properties.status = 500;

      return;
    }

    if (this.properties.title !== undefined) {
      return;
    }

    if (this.properties.status === 500) {
      this.properties.title = 'Internal server error';
    }

    if (this.properties.status === 404) {
      this.properties.title = 'Not found';
    }

    if (this.properties.status === 400) {
      this.properties.title = 'Bad request';
    }

    if (this.properties.status === 401) {
      this.properties.title = 'Unauthorized';
    }

    if (this.properties.status === 403) {
      this.properties.title = 'Forbidden';
    }

    if (this.properties.status === 405) {
      this.properties.title = 'Method not allowed';
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
