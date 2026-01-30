import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  Button,
  Input,
  Stack,
  Text,
  Flex,
  Box,
  NativeSelect,
} from "@chakra-ui/react";
// Correct import:
import { useData } from "../contexts/DataContext";
import { formatDateForInput } from "../lib/helpers";

const AddTransactionModal = ({ isOpen, onClose, transactionToEdit }) => {
  const { categories, accounts, addTransaction, editTransaction } = useData();

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: { date: formatDateForInput(), service_fee: 0 },
  });

  // Effect: When Modal Opens...
  useEffect(() => {
    if (isOpen) {
      if (transactionToEdit) {
        // EDIT MODE: Fill the form with existing data
        setValue("date", transactionToEdit.date);
        setValue("category_id", transactionToEdit.category_id || "");
        setValue(
          "negative_account_id",
          transactionToEdit.negative_account_id || "",
        );
        setValue(
          "positive_account_id",
          transactionToEdit.positive_account_id || "",
        );
        setValue("price", transactionToEdit.price);
        setValue("service_fee", transactionToEdit.service_fee || 0);
        setValue("description", transactionToEdit.description || "");
      } else {
        // ADD MODE: Reset to blank/today
        reset({ date: formatDateForInput(), service_fee: 0 });
      }
    }
  }, [isOpen, transactionToEdit, reset, setValue]);

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      negative_account_id: data.negative_account_id || null,
      positive_account_id: data.positive_account_id || null,
      category_id: data.category_id || null,
    };

    let success = false;

    if (transactionToEdit) {
      // Call EDIT function
      success = await editTransaction(transactionToEdit.id, formattedData);
    } else {
      // Call ADD function
      success = await addTransaction(formattedData);
    }

    if (success) onClose();
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      size="sm"
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            {/* Dynamic Title */}
            <Dialog.Title>
              {transactionToEdit ? "Edit Transaction" : "Add Transaction"}
            </Dialog.Title>
            <Dialog.CloseTrigger />
          </Dialog.Header>

          <Dialog.Body>
            <form id="tx-form" onSubmit={handleSubmit(onSubmit)}>
              <Stack gap={4}>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={1}>
                    Date
                  </Text>
                  <Input
                    type="date"
                    {...register("date", { required: true })}
                  />
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={1}>
                    Category
                  </Text>
                  <NativeSelect.Root>
                    <NativeSelect.Field
                      {...register("category_id")}
                      placeholder="Select Category"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.title}
                        </option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="bold" color="red.600" mb={1}>
                    Negative To (From)
                  </Text>
                  <NativeSelect.Root>
                    <NativeSelect.Field
                      {...register("negative_account_id")}
                      placeholder="Select Account"
                    >
                      {accounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.title} {acc.is_credit ? "(Credit)" : ""}
                        </option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color="green.600"
                    mb={1}
                  >
                    Positive To (To)
                  </Text>
                  <NativeSelect.Root>
                    <NativeSelect.Field
                      {...register("positive_account_id")}
                      placeholder="Select Account"
                    >
                      {accounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.title} {acc.is_credit ? "(Credit)" : ""}
                        </option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <Flex gap={3}>
                  <Box flex={1}>
                    <Text fontSize="sm" fontWeight="medium" mb={1}>
                      Price
                    </Text>
                    <Input
                      type="number"
                      step="0.01"
                      {...register("price", { required: true })}
                    />
                  </Box>
                  <Box w="30%">
                    <Text fontSize="sm" fontWeight="medium" mb={1}>
                      Fee
                    </Text>
                    <Input
                      type="number"
                      step="0.01"
                      {...register("service_fee")}
                    />
                  </Box>
                </Flex>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={1}>
                    Description
                  </Text>
                  <Input {...register("description")} />
                </Box>
              </Stack>
            </form>
          </Dialog.Body>

          <Dialog.Footer>
            <Button variant="outline" onClick={onClose} mr={2}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="tx-form"
              bg="blue.600"
              color="white"
              _hover={{ bg: "blue.700" }}
            >
              {transactionToEdit ? "Save Changes" : "Add Transaction"}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default AddTransactionModal;
