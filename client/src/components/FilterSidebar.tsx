import React from "react";
import {
  Card,
  CardBody,
  Checkbox,
  Slider,
  Select,
  SelectItem,
  Button,
  Input,
} from "@nextui-org/react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  toggleNote,
  toggleBrand,
  setPriceRange,
  setSortBy,
  resetFilters,
  setSearchQuery,
} from "../store/filterSlice";

const PERFUME_NOTES = [
  "Citrus",
  "Floral",
  "Woody",
  "Spicy",
  "Fresh",
  "Sweet",
  "Vanilla",
  "Musk",
];

const BRANDS = [
  "Chanel",
  "Dior",
  "Guerlain",
  "Yves Saint Laurent",
  "Tom Ford",
  "Creed",
];

export const FilterSidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedNotes, selectedBrands, priceRange, sortBy, searchQuery } =
    useAppSelector((state) => state.filters);

  return (
    <div className="space-y-4">
      <Card>
        <CardBody className="space-y-4">
          <h3 className="font-serif text-lg font-bold">Search</h3>
          <Input
            placeholder="Search perfumes..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            isClearable
          />
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-4">
          <h3 className="font-serif text-lg font-bold">Price Range</h3>
          <Slider
            label="Price"
            step={10}
            minValue={0}
            maxValue={500}
            value={priceRange as [number, number]}
            onChange={(value) => {
              if (Array.isArray(value)) {
                dispatch(setPriceRange([value[0] as number, value[1] as number]));
              }
            }}
            className="max-w-md"
          />
          <span className="text-sm text-gray-500">
            ${priceRange[0]} - ${priceRange[1]}
          </span>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-4">
          <h3 className="font-serif text-lg font-bold">Sort By</h3>
          <Select
            selectedKeys={[sortBy]}
            onChange={(e) => {
              const value = e.target.value as "name" | "price" | "rating";
              dispatch(setSortBy(value));
            }}
          >
            <SelectItem key="name">Name</SelectItem>
            <SelectItem key="price">Price</SelectItem>
            <SelectItem key="rating">Rating</SelectItem>
          </Select>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-4">
          <h3 className="font-serif text-lg font-bold">Top Notes</h3>
          <div className="space-y-2">
            {PERFUME_NOTES.map((note) => (
              <Checkbox
                key={note}
                isSelected={selectedNotes.includes(note)}
                onChange={() => dispatch(toggleNote(note))}
              >
                {note}
              </Checkbox>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-4">
          <h3 className="font-serif text-lg font-bold">Brand</h3>
          <div className="space-y-2">
            {BRANDS.map((brand) => (
              <Checkbox
                key={brand}
                isSelected={selectedBrands.includes(brand)}
                onChange={() => dispatch(toggleBrand(brand))}
              >
                {brand}
              </Checkbox>
            ))}
          </div>
        </CardBody>
      </Card>

      <Button
        fullWidth
        color="danger"
        variant="flat"
        onClick={() => dispatch(resetFilters())}
      >
        Reset Filters
      </Button>
    </div>
  );
};
