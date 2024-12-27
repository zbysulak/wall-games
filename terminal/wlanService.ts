import { exec } from "child_process"

function getConnectedDevices(): Promise<{ ip: string; mac: string }[]> {
  return new Promise((resolve, reject) => {
    exec("arp -a", (err: any, stdout: string, stderr: string) => {
      if (err) {
        reject(`Error executing ARP command: ${err.message}`)
        return
      }
      if (stderr) {
        reject(`Error: ${stderr}`)
        return
      }

      // Parse ARP output
      const devices = []
      const lines = stdout.split("\n")
      for (let line of lines) {
        const match = line.match(/(\d+\.\d+\.\d+\.\d+)\s+([0-9a-fA-F-]+)/) // Match IP, MAC
        if (match) {
          devices.push({
            ip: match[1],
            mac: match[2]
          })
        }
      }

      resolve(devices)
    })
  })
}

export function findIpByMacAddress(mac: string): Promise<string> {
  return getConnectedDevices().then((e) => {
    const r = e.filter((e) => e.mac == mac)
    if (r.length != 1) throw new Error("mac address not found")
    else return r[0].ip
  })
}
