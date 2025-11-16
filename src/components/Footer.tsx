export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-4 py-6">
        <p className="text-center text-sm text-muted-foreground">
          © {currentYear} Play Kenya. All rights reserved. Developed by Henry Muchiri.
        </p>
      </div>
    </footer>
  );
}
