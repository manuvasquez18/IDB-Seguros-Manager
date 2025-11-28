// This page is no longer used directly. The functionality has been moved to /seguros/[id]
import { redirect } from 'next/navigation';

export default function ContactosRedirectPage() {
  redirect('/seguros');
}
