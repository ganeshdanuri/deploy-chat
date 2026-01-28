"use client";

import { theme } from "../theme";

interface Company {
  name: string;
  logo: string;
}

interface CompaniesSectionProps {
  companies: Company[];
}

export default function CompaniesSection({ companies }: CompaniesSectionProps) {
  return (
    <div className="mt-16">
      <div className="flex flex-wrap items-center justify-center gap-8 opacity-40 grayscale">
        {companies.map((company) => (
          <div
            key={company.name}
            className="text-2xl font-bold"
            style={{ color: theme.colors.neutral[900] }}
          >
            {company.logo}
          </div>
        ))}
      </div>
    </div>
  );
}
