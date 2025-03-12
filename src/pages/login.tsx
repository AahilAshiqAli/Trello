/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
  component: LoginComponent,
});

function LoginComponent() {
  return <div className="bg-primary">Hello login</div>;
}
