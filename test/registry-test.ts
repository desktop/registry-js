import { enumerateValues, enumerateKeys, HKEY } from "../lib/index";

if (process.platform === "win32") {
  describe("enumerateValue", () => {
    it("can read strings from the registry", () => {
      const values = enumerateValues(
        HKEY.HKEY_LOCAL_MACHINE,
        "SOFTWARE\\Microsoft\\Windows\\CurrentVersion"
      );

      const programFilesDir = values.find(v => v.name == "ProgramFilesDir");
      expect(programFilesDir!.type).toBe("REG_SZ");
      expect(programFilesDir!.data).toContain(":\\Program Files");

      const programFilesPath = values.find(v => v.name == "ProgramFilesPath");
      expect(programFilesPath!.type).toBe("REG_EXPAND_SZ");
      expect(programFilesPath!.data).toBe("%ProgramFiles%");
    });

    it("can read numbers from the registry", () => {
      const values = enumerateValues(
        HKEY.HKEY_LOCAL_MACHINE,
        "SOFTWARE\\Microsoft\\Windows\\Windows Error Reporting"
      );

      const serviceTimeout = values.find(v => v.name == "ServiceTimeout");
      expect(serviceTimeout!.type).toBe("REG_DWORD");
      expect(serviceTimeout!.data).toBe(60000);
    });

    it("can read values from HKCU", () => {
      const values = enumerateValues(
        HKEY.HKEY_CURRENT_USER,
        "SOFTWARE\\Microsoft\\Windows\\DWM"
      );

      const composition = values.find(v => v.name == "Composition");
      expect(composition!.type).toBe("REG_DWORD");
      expect(composition!.data).toBe(1);
    });

    it("returns empty array when key is missing", () => {
      const values = enumerateValues(HKEY.HKEY_LOCAL_MACHINE, "blahblahblah");

      expect(values).toEqual([]);
    });
  });
  describe("enumerateKeys", () => {
    it("can enumerate key names from the registry (No subkey)", () => {
      const values = enumerateKeys(HKEY.HKEY_LOCAL_MACHINE, null);

      expect(values.indexOf("HARDWARE")).toBeGreaterThanOrEqual(0);
      expect(values.indexOf("SOFTWARE")).toBeGreaterThanOrEqual(0);
      expect(values.indexOf("SYSTEM")).toBeGreaterThanOrEqual(0);
    });
    it("can enumerate key names from the registry", () => {
      const values = enumerateKeys(HKEY.HKEY_LOCAL_MACHINE, "SOFTWARE");

      expect(values.indexOf("Classes")).toBeGreaterThanOrEqual(0);
      expect(values.indexOf("Microsoft")).toBeGreaterThanOrEqual(0);
    });
  });
}
