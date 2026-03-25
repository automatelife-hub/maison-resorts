import Link from "next/link";
import { PriceDisplay } from "./PriceDisplay";

interface DestinationCardProps {
  countryCode: string;
  countryName: string;
  image: string;
  minPrice?: number;
  currency?: string;
}

export function DestinationCard({
  countryCode,
  countryName,
  image,
  minPrice,
  currency = "USD",
}: DestinationCardProps) {
  return (
    <Link href={`/explore/${countryCode}`}>
      <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
        {/* Image */}
        <div className="relative h-64 bg-gray-200">
          <img
            src={image}
            alt={countryName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-4">
          <h3 className="text-white text-2xl font-bold mb-2">{countryName}</h3>
          {minPrice !== undefined && (
            <div className="flex items-baseline gap-2">
              <span className="text-white text-sm">From</span>
              <PriceDisplay
                price={minPrice}
                currency={currency}
                className="text-white"
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
