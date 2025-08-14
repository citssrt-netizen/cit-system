import React from 'react';
import { RunForm } from '../../components/RunForm';

export default function CreateRunPage() {
  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>Create New CIT Run</h2>
      <RunForm />
    </div>
  );
}
