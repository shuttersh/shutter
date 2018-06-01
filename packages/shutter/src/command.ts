export type CommandFunction = (args: string[], flags: { [flagName: string]: any }) => Promise<any>

export interface Command {
  help: string,
  minimumArgs?: number,
  command: CommandFunction
}

export const showCommandHelp = (command: Command) => {
  const helpText = command.help.startsWith('\n') ? command.help.substr(1) : command.help
  console.log(helpText)
}
