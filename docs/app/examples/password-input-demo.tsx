import { useState } from 'react';
import { PasswordInput } from '@/components/password-input';

export default function PasswordInputDemo() {
  const [password, setPassword] = useState('');

  return (
    <div className="w-full max-w-sm mx-auto">
      <PasswordInput
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password..."
        value={password}
      />
    </div>
  );
}
