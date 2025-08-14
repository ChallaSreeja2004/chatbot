// src/nhost.js
import { NhostClient } from '@nhost/react';

const nhost = new NhostClient({
  subdomain: 'fhexujvsxkslgwjmjyxm', // Your project subdomain
  region: 'ap-south-1'              // Your project region
});

export { nhost };