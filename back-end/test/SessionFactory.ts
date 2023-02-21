import { INestApplication } from '@nestjs/common';
import { agent } from 'supertest';
import { Response, Headers } from 'node-fetch';

export class SessionFactory {
    constructor(private app: INestApplication) {}

    async create() {
        
    }
}