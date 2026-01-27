import { redirect } from 'next/navigation';

// Redirect oude CMS URL naar nieuwe Visual CMS
export default function OldCMSRedirect() {
  redirect('/cms');
}
