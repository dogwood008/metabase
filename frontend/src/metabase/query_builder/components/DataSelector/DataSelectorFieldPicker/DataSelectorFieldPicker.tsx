import React from "react";
import { t } from "ttag";

import AccordionList from "metabase/core/components/AccordionList";
import Icon from "metabase/components/Icon";
import DataSelectorLoading from "../DataSelectorLoading";

import {
  Container,
  HeaderContainer,
  HeaderName,
} from "./DataSelectorFieldPicker.styled";

import type { Field } from "metabase-types/api/field";
import type { Table } from "metabase-types/api/table";

type DataSelectorFieldPickerProps = {
  fields: Field[];
  hasFiltering: boolean;
  hasInitialFocus: boolean;
  isLoading: boolean;
  selectedField: Field;
  selectedTable: Table;
  onBack: () => void;
  onChangeField: (field: Field) => void;
};

type HeaderProps = {
  onBack: DataSelectorFieldPickerProps["onBack"];
  selectedTable: DataSelectorFieldPickerProps["selectedTable"];
};

type FieldWithName = {
  name: string;
  field: {
    id: number;
    dimension: () => any;
  };
};

const DataSelectorFieldPicker = ({
  isLoading,
  fields,
  selectedTable,
  selectedField,
  onChangeField,
  onBack,
  hasFiltering,
  hasInitialFocus,
}: DataSelectorFieldPickerProps) => {
  const header = <Header onBack={onBack} selectedTable={selectedTable} />;

  if (isLoading) {
    return <DataSelectorLoading header={header} />;
  }

  const sections = [
    {
      name: header,
      items: fields.map(field => ({
        name: field.display_name,
        field: field,
      })),
    },
  ];

  const checkIfItemIsSelected = (item: FieldWithName) =>
    item.field && selectedField && item.field.id === selectedField.id;

  const renderItemIcon = (item: FieldWithName) =>
    item.field && <Icon name={item.field.dimension().icon()} size={18} />;

  return (
    <Container>
      <AccordionList
        id="FieldPicker"
        key="fieldPicker"
        className="text-brand"
        hasInitialFocus={hasInitialFocus}
        sections={sections}
        maxHeight={Infinity}
        width="100%"
        searchable={hasFiltering}
        onChange={(item: { field: Field }) => onChangeField(item.field)}
        itemIsSelected={checkIfItemIsSelected}
        itemIsClickable={(item: FieldWithName) => item.field}
        renderItemIcon={renderItemIcon}
      />
    </Container>
  );
};

const Header = ({ onBack, selectedTable }: HeaderProps) => (
  <HeaderContainer onClick={onBack}>
    <Icon name="chevronleft" size={18} />
    <HeaderName>{selectedTable?.display_name || t`Fields`}</HeaderName>
  </HeaderContainer>
);

export default DataSelectorFieldPicker;
