/**
 * Tool Parser - Extracts and parses tool usage from agent message content
 * Handles <tool_use>, <tool_result> XML-like tags from Claude's responses
 */

export interface ParsedToolUsage {
  toolName: string;
  parameters: Record<string, string>;
  result?: string;
  rawContent: string;
}

export interface ParsedContent {
  cleanContent: string;
  toolUsages: ParsedToolUsage[];
}

/**
 * Parses content to extract tool usage tags and clean content
 */
export function parseToolUsage(content: string): ParsedContent {
  const toolUsages: ParsedToolUsage[] = [];
  let cleanContent = content;

  // Regex to match tool_use blocks with their results
  const toolUseRegex = /<tool_use>\s*<tool_name>(.*?)<\/tool_name>\s*<tool_parameters>([\s\S]*?)<\/tool_parameters>\s*<\/tool_use>(?:\s*<tool_result>([\s\S]*?)<\/tool_result>)?/gi;

  let match;
  while ((match = toolUseRegex.exec(content)) !== null) {
    const [fullMatch, toolName, paramsStr, result] = match;
    
    // Parse parameters (JSON-like format)
    const parameters: Record<string, string> = {};
    const paramRegex = /"(\w+)":\s*"([^"]*?)"/g;
    let paramMatch;
    while ((paramMatch = paramRegex.exec(paramsStr)) !== null) {
      parameters[paramMatch[1]] = paramMatch[2];
    }

    toolUsages.push({
      toolName: toolName.trim(),
      parameters,
      result: result?.trim(),
      rawContent: fullMatch,
    });

    // Remove this tool usage from clean content
    cleanContent = cleanContent.replace(fullMatch, '');
  }

  // Clean up any extra whitespace left behind
  cleanContent = cleanContent.replace(/\n{3,}/g, '\n\n').trim();

  return {
    cleanContent,
    toolUsages,
  };
}

/**
 * Extracts search query from parameters
 */
export function extractSearchQuery(parameters: Record<string, string>): string | undefined {
  return parameters.query || parameters.search || parameters.q;
}

/**
 * Formats tool name for display
 */
export function formatToolName(toolName: string): string {
  return toolName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Parses tool result into structured data (if it's a web search)
 */
export function parseToolResult(result: string | undefined): Array<{title: string; url: string; snippet?: string}> | null {
  if (!result) return null;

  try {
    // Try to extract search result info from the result text
    const results: Array<{title: string; url: string; snippet?: string}> = [];
    
    // Look for patterns like "1. [Title](url)" or similar
    const urlRegex = /https?:\/\/[^\s]+/g;
    const urls = result.match(urlRegex);
    
    if (urls && urls.length > 0) {
      urls.forEach((url, idx) => {
        // Try to find title near this URL
        const urlIndex = result.indexOf(url);
        const beforeUrl = result.substring(Math.max(0, urlIndex - 100), urlIndex);
        const titleMatch = beforeUrl.match(/[A-Z][^.!?\n]*(?=[:\n]|$)/);
        
        results.push({
          title: titleMatch?.[0]?.trim() || `Result ${idx + 1}`,
          url: url.trim(),
        });
      });
    }
    
    return results.length > 0 ? results : null;
  } catch (error) {
    return null;
  }
}

