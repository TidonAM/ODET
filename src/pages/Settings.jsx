import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  Input,
  Button,
  Flex,
  Stack,
  Badge,
  Separator,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import {
  IoTrashOutline,
  IoPencilOutline,
  IoCheckmarkOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

// --- Sub-component for Adding Items ---
const SettingsForm = ({ type, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [color, setColor] = useState(
    type === "category" ? "#3b82f6" : "#10b981",
  );

  // Credit Card Specific State
  const [isCredit, setIsCredit] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [minPay, setMinPay] = useState(0);
  const [interestRate, setInterestRate] = useState(0); // NEW: Interest Rate

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title) {
      onSubmit({
        title,
        color,
        is_credit: type === "account" ? isCredit : false,
        due_date:
          type === "account" && isCredit && dueDate ? parseInt(dueDate) : null,
        min_payment_percent:
          type === "account" && isCredit ? parseFloat(minPay) : 0,
        interest_rate:
          type === "account" && isCredit ? parseFloat(interestRate) : 0, // NEW
      });
      // Reset Form
      setTitle("");
      setIsCredit(false);
      setDueDate("");
      setMinPay(0);
      setInterestRate(0);
    }
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      bg="gray.50"
      p={4}
      borderRadius="lg"
      mb={6}
    >
      <Stack gap={4}>
        {/* ROW 1: Title, Color, Add Button */}
        <Flex gap={3} align="flex-end">
          <Box flex={1}>
            <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={1}>
              TITLE
            </Text>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`New ${type}...`}
              bg="white"
              required
            />
          </Box>
          <Box>
            <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={1}>
              COLOR
            </Text>
            <Input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              p={1}
              h="40px"
              w="60px"
              cursor="pointer"
              bg="white"
            />
          </Box>
          <Button type="submit" bg="blue.600" color="white" px={6}>
            Add
          </Button>
        </Flex>

        {/* ROW 2: Credit Card Options (Only for Accounts) */}
        {type === "account" && (
          <Stack gap={3}>
            <Separator />
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isCredit}
                onChange={(e) => setIsCredit(e.target.checked)}
                className="rounded text-blue-600"
              />
              <Text fontSize="sm" fontWeight="medium">
                Is this a Credit Card?
              </Text>
            </label>
            {isCredit && (
              <Flex gap={4}>
                <Box w="80px">
                  <Text fontSize="xs" fontWeight="bold" color="gray.500">
                    Due Day
                  </Text>
                  <Input
                    type="number"
                    min="1"
                    max="31"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    bg="white"
                    size="sm"
                    placeholder="1-31"
                  />
                </Box>
                <Box w="80px">
                  <Text fontSize="xs" fontWeight="bold" color="gray.500">
                    Min Pay %
                  </Text>
                  <Input
                    type="number"
                    step="0.1"
                    value={minPay}
                    onChange={(e) => setMinPay(e.target.value)}
                    bg="white"
                    size="sm"
                    placeholder="%"
                  />
                </Box>
                <Box w="80px">
                  <Text fontSize="xs" fontWeight="bold" color="gray.500">
                    Int. Rate %
                  </Text>
                  <Input
                    type="number"
                    step="0.01"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    bg="white"
                    size="sm"
                    placeholder="3.5"
                  />
                </Box>
              </Flex>
            )}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

// --- COMPONENT: Editable Item Row (With Safe Edit Logic) ---
const EditableItem = ({ item, type, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(item.title);
  const [tempColor, setTempColor] = useState(item.color);

  // Credit Edit States
  const [tempDueDate, setTempDueDate] = useState(item.due_date || "");
  const [tempMinPay, setTempMinPay] = useState(item.min_payment_percent || 0);
  const [tempInterest, setTempInterest] = useState(item.interest_rate || 0); // NEW

  const handleSave = () => {
    onEdit(item.id, {
      title: tempTitle,
      color: tempColor,
      // Only update credit details if it IS ALREADY a credit account
      due_date: item.is_credit ? parseInt(tempDueDate) : null,
      min_payment_percent: item.is_credit ? parseFloat(tempMinPay) : 0,
      interest_rate: item.is_credit ? parseFloat(tempInterest) : 0,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original values
    setTempTitle(item.title);
    setTempColor(item.color);
    setTempDueDate(item.due_date || "");
    setTempMinPay(item.min_payment_percent || 0);
    setTempInterest(item.interest_rate || 0);
    setIsEditing(false);
  };

  // --- VIEW: EDIT MODE ---
  if (isEditing) {
    return (
      <Flex
        direction="column"
        gap={3}
        p={3}
        borderWidth="1px"
        borderRadius="lg"
        bg="blue.50"
      >
        <Flex gap={2}>
          <Input
            size="sm"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            bg="white"
          />
          <Input
            type="color"
            size="sm"
            w="50px"
            p={0}
            value={tempColor}
            onChange={(e) => setTempColor(e.target.value)}
            cursor="pointer"
          />
        </Flex>

        {/* CREDIT CARD FIELDS (Visible ONLY if account is already Credit) */}
        {/* We do NOT allow toggling 'is_credit' here to protect history */}
        {type === "account" && item.is_credit && (
          <Box borderTopWidth="1px" borderColor="blue.200" pt={2}>
            <Text fontSize="xs" fontWeight="bold" color="blue.600" mb={2}>
              CARD SETTINGS
            </Text>
            <Flex gap={2}>
              <Box>
                <Text fontSize="xx-small" color="gray.500" mb="1px">
                  DUE DAY
                </Text>
                <Input
                  size="xs"
                  type="number"
                  min="1"
                  max="31"
                  value={tempDueDate}
                  onChange={(e) => setTempDueDate(e.target.value)}
                  bg="white"
                />
              </Box>
              <Box>
                <Text fontSize="xx-small" color="gray.500" mb="1px">
                  MIN %
                </Text>
                <Input
                  size="xs"
                  type="number"
                  step="0.1"
                  value={tempMinPay}
                  onChange={(e) => setTempMinPay(e.target.value)}
                  bg="white"
                />
              </Box>
              <Box>
                <Text fontSize="xx-small" color="gray.500" mb="1px">
                  INT %
                </Text>
                <Input
                  size="xs"
                  type="number"
                  step="0.01"
                  value={tempInterest}
                  onChange={(e) => setTempInterest(e.target.value)}
                  bg="white"
                />
              </Box>
            </Flex>
          </Box>
        )}

        <Flex justify="flex-end" gap={2}>
          <IconButton
            size="xs"
            colorPalette="green"
            onClick={handleSave}
            variant="solid"
          >
            <IoCheckmarkOutline />
          </IconButton>
          <IconButton
            size="xs"
            colorPalette="gray"
            onClick={handleCancel}
            variant="ghost"
          >
            <IoCloseOutline />
          </IconButton>
        </Flex>
      </Flex>
    );
  }

  // --- VIEW: DISPLAY MODE ---
  return (
    <Flex
      align="center"
      justify="space-between"
      p={3}
      borderWidth="1px"
      borderRadius="lg"
      _hover={{ bg: "gray.50" }}
    >
      <Flex align="center" gap={3}>
        <Box w={4} h={4} borderRadius="full" bg={item.color} shadow="sm" />
        <Box>
          <Text fontWeight="medium" color="gray.700">
            {item.title}
          </Text>
          {type === "account" && item.is_credit && (
            <Text fontSize="xs" color="gray.400">
              Due: {item.due_date} | Min: {item.min_payment_percent}% |{" "}
              <Text as="span" color="red.400">
                Int: {item.interest_rate}%
              </Text>
            </Text>
          )}
        </Box>
        {type === "account" && item.is_credit && (
          <Badge size="xs" colorPalette="red" variant="subtle">
            CREDIT
          </Badge>
        )}
      </Flex>

      <HStack gap={1}>
        <IconButton
          size="xs"
          variant="ghost"
          bg="blue.600"
          color="white"
          onClick={() => setIsEditing(true)}
        >
          <IoPencilOutline />
        </IconButton>
        {onDelete && (
          <IconButton
            size="xs"
            variant="ghost"
            colorPalette="red"
            onClick={() => onDelete(item.id)}
          >
            <IoTrashOutline />
          </IconButton>
        )}
      </HStack>
    </Flex>
  );
};

const Settings = () => {
  const {
    categories,
    accounts,
    addCategory,
    addAccount,
    editCategory,
    editAccount,
    deleteCategory,
    deleteAccount,
  } = useData();

  const { session, signOut } = useAuth();

  // Profile State
  const [profileLoading, setProfileLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");

  // Load Profile Data
  useEffect(() => {
    if (session?.user) {
      const meta = session.user.user_metadata || {};
      const newName = meta.username || meta.full_name || "";
      const newWeb = meta.website || "";

      // 1. Guard Clause: Only set state if it is different to prevent loops
      if (username !== newName) setUsername(newName);
      if (website !== newWeb) setWebsite(newWeb);

      setProfileLoading(false);
    }
    // 2. Dependency Change: Track the ID (string), not the whole object
    // We also disable the exhaustive-deps rule for 'username'/'website'
    // because we only want this to run when the USER changes, not when you type.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  async function updateProfile(e) {
    e.preventDefault();
    setProfileLoading(true);

    const { error } = await supabase.auth.updateUser({
      data: {
        username: username,
        website: website,
      },
    });

    if (error) {
      alert("Error updating profile: " + error.message);
    } else {
      alert("Profile updated successfully!");
    }
    setProfileLoading(false);
  }

  return (
    <Container maxW="1200px" py={8}>
      <Heading as="h1" size="2xl" mb={8} color="gray.800">
        System Settings
      </Heading>

      <SimpleGrid columns={{ base: 1, lg: 3 }} gap={8}>
        {/* PROFILE SECTION */}
        <Box
          bg="white"
          p={6}
          borderRadius="xl"
          shadow="sm"
          borderWidth="1px"
          borderColor="gray.100"
        >
          <Flex align="center" mb={6} gap={3}>
            <Box bg="blue.50" color="blue.600" p={2} borderRadius="lg">
              👤
            </Box>
            <Heading size="md">User Profile</Heading>
          </Flex>
          <Stack as="form" onSubmit={updateProfile} gap={4}>
            <Box>
              <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={1}>
                DISPLAY NAME
              </Text>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Box>
            <Box>
              <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={1}>
                WEBSITE
              </Text>
              <Input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </Box>
            <Stack pt={4} gap={3}>
              <Button
                type="submit"
                bg="blue.600"
                color="white"
                width="full"
                loading={profileLoading}
              >
                Update Profile
              </Button>
              <Button
                type="button"
                onClick={signOut}
                variant="outline"
                colorPalette="red"
                width="full"
              >
                Sign Out
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* CATEGORIES SECTION */}
        <Box
          bg="white"
          p={6}
          borderRadius="xl"
          shadow="sm"
          borderWidth="1px"
          borderColor="gray.100"
        >
          <Flex align="center" mb={6} gap={3}>
            <Box bg="purple.50" color="purple.600" p={2} borderRadius="lg">
              🏷️
            </Box>
            <Heading size="md">Categories</Heading>
          </Flex>
          <SettingsForm type="category" onSubmit={addCategory} />
          <Stack maxH="300px" overflowY="auto" gap={2} pr={2}>
            {categories.map((cat) => (
              <EditableItem
                key={cat.id}
                item={cat}
                type="category"
                onEdit={editCategory}
                onDelete={deleteCategory}
              />
            ))}
          </Stack>
        </Box>

        {/* ACCOUNTS SECTION */}
        <Box
          bg="white"
          p={6}
          borderRadius="xl"
          shadow="sm"
          borderWidth="1px"
          borderColor="gray.100"
        >
          <Flex align="center" mb={6} gap={3}>
            <Box bg="green.50" color="green.600" p={2} borderRadius="lg">
              💳
            </Box>
            <Heading size="md">Accounts</Heading>
          </Flex>
          <SettingsForm type="account" onSubmit={addAccount} />
          <Stack maxH="300px" overflowY="auto" gap={2} pr={2}>
            {accounts.map((acc) => (
              <EditableItem
                key={acc.id}
                item={acc}
                type="account"
                onEdit={editAccount}
                onDelete={deleteAccount}
              />
            ))}
          </Stack>
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default Settings;
