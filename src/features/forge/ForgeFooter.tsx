import { Box, Text } from "@chakra-ui/react";

interface ForgeFooterProps {
  totalReforges: number;
  reforgeCap: number;
}

export function ForgeFooter({ totalReforges, reforgeCap }: ForgeFooterProps) {
  return (
    <Box
      mt="10px"
      py="8px"
      px="12px"
      bg="never.dock"
      borderRadius="8px"
      fontSize="10px"
      color="never.stat"
      lineHeight={1.6}
    >
      {totalReforges} total reforges · cap: {reforgeCap}
      <br />
      <Text as="span" color="#ff557766">
        💀 = multiple of 3 (dangerous)
      </Text>
      {reforgeCap < 7 && (
        <>
          <br />
          <Text as="span" color="#bb99ff66">
            Raise cap above 6 to reach safe values
          </Text>
        </>
      )}
    </Box>
  );
}
