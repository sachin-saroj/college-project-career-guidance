import { PageWrapper } from "../components/layout/PageWrapper";
import { Card, CardContent } from "../components/ui/Card";
import { Construction } from "lucide-react";

export const PlaceholderPage = ({ title }: { title: string }) => {
  return (
    <PageWrapper>
      <div className="flex flex-col h-full items-center justify-center pt-64">
        <Card className="w-full max-w-md bg-white">
          <CardContent className="p-32 flex flex-col items-center text-center">
            <div className="h-64 w-64 bg-brand-light rounded-full flex items-center justify-center text-brand-primary mb-24">
              <Construction size={32} />
            </div>
            <h1 className="text-h3 font-bold text-text-main mb-8">{title}</h1>
            <p className="text-body text-text-muted">
              This page is currently under construction. Check back later!
            </p>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
};
