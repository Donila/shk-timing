const parseDurationToSeconds = (durationString) => {
  let totalSeconds = 0;
  // Regex to capture digits followed by 'h', 'm', or 's'
  const regex = /(\d+)\s*(h|m|s)/g;
  let matches;

  // Iterate over all matches in the string
  while ((matches = regex.exec(durationString)) !== null) {
    const value = parseInt(matches[1], 10);
    const unit = matches[2];

    if (unit === 'h') {
      totalSeconds += value * 3600; // 1 hour = 3600 seconds
    } else if (unit === 'm') {
      totalSeconds += value * 60; // 1 minute = 60 seconds
    } else if (unit === 's') {
      totalSeconds += value;
    } else if (unit === 'd') {
      totalSeconds += value * 3600 * 24;
    }
  }

  return totalSeconds;
}

const convertFromDiscordBot = (str) => {
  const allLines = str.split('\n');

  if (allLines.length > 4) {
    const allNeededArmies = allLines.slice(3, allLines.length - 1);
    const armiesParsed = allNeededArmies.map(p => {
      const splitLines = p.split('|');
      const timeString = splitLines[2].trim();
      const seconds = parseDurationToSeconds(timeString);

      return {
        name: splitLines[1].trim(),
        speed: 1,
        delay: 0,
        time: seconds,
      };
    });

    return armiesParsed;
  }

  return [];
}

export { 
  convertFromDiscordBot
}