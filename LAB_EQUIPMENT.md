<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<!-- Generated from the hardware lab request list of September 2026 (v2, 23 September 2026). -->

# Lab equipment

This is the equipment the lab needs so that the open projects can be measured
on real hardware and the research can run on adequate compute. It is the same
list sent to manufacturers and distributors in September 2026. Partial support
is welcome, and items can be given in kind. Measurement protocols, raw data and
reports are published openly, including negative results.

Contact: [protoscience@anulum.li](mailto:protoscience@anulum.li) ·
[GitHub Sponsors](https://github.com/sponsors/anulum) · back to the
[profile](README.md#sponsorship-goals)

## Estimated value

The items with a published manufacturer price add up to an estimate of **about CHF 404,470**: priority A about CHF 5,520, priority B about CHF 49,670, priority C about CHF 29,440, priority E about CHF 7,760, priority G about CHF 312,080.

The basis is the manufacturers' list prices of 14 September 2026, excluding VAT, shipping and customs (Arduino prices including VAT), converted at the European Central Bank reference rate of the same day. The items of priority G are net dealer and configurator prices of 23 September 2026, converted at the same reference rate; memory and GPU prices are currently volatile. 36 items without a published manufacturer price are not included, among them the accessories, several development kits, the node with eight GPUs (publicly reported reference prices about USD 400,000 to 515,000) and the professional real-time test system (project planning estimate of June 2026: about USD 12,000 to more than 120,000, depending on the system). The actual value depends on the supplier's prices.

## The list, by priority

### Priority A: Measurement bench and reference platforms

Priority A verifies for the first time whether the projects hold on real hardware what they show in software. SC-NeuroCore measures accuracy, latency and energy per inference on a Zynq-7020 and compares with established microcontroller references. SCPN Fusion Core replaces simulated data acquisition with a physical loop and measures its latency as a distribution with independent timing traces. The result is the first public measurement reports with raw data and a repeatable set-up.

| No. | Item (manufacturer, order code) | Qty | Purpose |
|----|--------------------------------------|-----|------------------------------|
| A1 | TUL PYNQ-Z2 with basic accessories (1M1-M000127DVB) | 2 | accuracy, latency and power of the synthesised design on the board; MIF lower timing bound |
| A2 | Digilent PYNQ-Z1 with accessory kit (240-114-1), only if PYNQ-Z2 is unavailable | (2) | as PYNQ-Z2, after re-synthesis with its own pin constraints |
| A3 | Adafruit INA219 current/power sensor (#904); equivalent INA260 (#4226) or INA228 (#5832) | 4 | power per supply rail during inference |
| A4 | Joulescope JS320-K001 energy analyser (ISO 17025 calibration) with FP02-USB front panel | 1 | energy per inference with a calibrated instrument |
| A5 | Saleae Logic Pro 16 (SAL-00115) | 1 | timing of spikes, control and trigger signals as an independent trace |
| A6 | Red Pitaya STEMlab 125-14 PRO Z7020 Gen 2 Starter Kit (IZD0052) | 1 | physical ADC/DAC loop instead of simulation; latency as median, 95th and 99th percentile |
| A7 | 1BitSquared iCEBreaker V1.1a (iCE40UP5K) | 2 | energy use of a microwatt design on iCE40 |
| A8 | STMicroelectronics NUCLEO-H753ZI | 1 | comparison with TensorFlow Lite Micro and CMSIS-NN on Cortex-M7 |
| A9 | STMicroelectronics STM32F746G-DISCO | 1 | second Cortex-M7 reference platform |
| A10 | Arduino Nano 33 BLE Sense Rev2 (ABX00070 or ABX00069) | 2 | comparison with TensorFlow Lite Micro on Cortex-M4F |
| A11 | Mini-Circuits attenuators VAT-3A+, VAT-6A+, VAT-10A+, VAT-20A+ | 2 each | defined, repeatable signal path for the loop measurement |
| A12 | Mini-Circuits 50 Ω termination ANNE-50+ | 4 | defined terminations of the signal path |
| A13 | Mini-Circuits SMA adapters SM-BF50+ and SM-BM50+ | 4 each | connecting the signal path |
| A14 | Mini-Circuits low-pass filter FL086-12SM+ | 6 | suppression of interference in the loop |
| A15 | Pomona 4119-50 BNC feed-through termination 50 Ω | 4 | defined terminations at BNC inputs |
| A16 | Pomona BNC-C cables RG58, lengths 24″ and 48″ | 6 | signal path connections |
| A17 | Adafruit level shifter BSS138, 4 channels (#757) | 6 | safe logic levels between set-up and device under test |
| A18 | SparkFun Logic Level Converter BOB-12009 | 4 | safe logic levels between set-up and device under test |
| A19 | MikroElektronika SPI Isolator 2 Click (MIKROE-4415) | 4 | measurement without ground loops on SPI lines |
| A20 | Adafruit ISO1540 I²C isolator (#4903) | 2 | measurement without ground loops on I²C lines |
| A21 | Rigol DP832A programmable bench power supply, 3 channels | 1 | reproducible, logged supply for all set-ups |
| A22 | Rigol 10 A test leads for DP832 series | 2 | connecting devices under test to the supply |
| A23 | Intona 7054-X USB 2.0 isolator 2.5 kV | 2 | logging host galvanically isolated from the device under test |
| A24 | Desco 16475 ESD field kit (mat, ground cord, wrist strap) | 1 | protection of sensitive boards during set-up |
| A25 | ESD bench mat with ground cord and wrist-strap tester | 1 | protection of sensitive boards during set-up |
| A26 | Digilent JTAG-HS2 programming cable (410-249) | 2 | programming and debugging boards without on-board JTAG |

### Priority B: FPGA boards, instruments and target hardware from the project plans

Priority B extends the measurements to the platforms explicitly named in the project plans. SCPN MIF Core verifies post-route timing on the target devices ZU3EG and ZU9EG on the board and builds a calibrated data set. SCPN Control measures latency, jitter and deadline compliance on Raspberry Pi, Jetson and an industrial PC with a real-time kernel, including fault and safe-state tests. Second, independent energy instruments cross-check the energy values.

| No. | Item (manufacturer, order code) | Qty | Purpose |
|----|--------------------------------------|-----|------------------------------|
| B1 | Digilent Arty A7-100T (410-319-1) | 1 | the same designs on Artix-7 without processor system |
| B2 | Digilent Nexys A7-100T (410-292) | 1 | larger Artix-7 designs with more peripherals |
| B3 | Digilent ZedBoard (410-248) | 1 | Zynq-7020 with FMC connector for measurement modules |
| B4 | Avnet Ultra96-V2 (AES-ULTRA96-V2-G, ZU3EG) from remaining stock, with power supply AES-ACC-U96-4APWR, JTAG module AES-ACC-U96-JTAG and heatsink AES-ACC-U96-PHS1 | 1 | MIF post-route timing on ZU3EG, verified on the board |
| B5 | AMD ZCU102 Evaluation Kit (EK-U1-ZCU102-G, ZU9EG) | 1 | MIF timing on the deployment target ZU9EG, verified on the board |
| B6 | AMD KCU105 Evaluation Kit (EK-U1-KCU105-G) | 1 | high-performance target Kintex UltraScale |
| B7 | Terasic DE10-Lite (P0466) | 1 | entry-level target Altera MAX 10 |
| B8 | Terasic DE1-SoC (P0159) with microSD kit B0844 | 1 | Altera Cyclone V with processor system |
| B9 | Terasic DE10-Pro Stratix 10 SX (P0646) | 1 | high-performance target Stratix 10 |
| B10 | Radiona ULX3S 85F and 12F | 1 each | ECP5 with open toolchain: reproducibility without vendor tools |
| B11 | Sipeed Tang Primer 25K with SDRAM module | 1 | target family Gowin |
| B12 | tinyVision.ai UPduino v3.1 | 2 | several iCE40 boards for repeat measurements |
| B13 | Colorlight i5 v7.0 with Muse Lab extension board | 1 | second ECP5 target |
| B14 | Monsoon High Voltage Power Monitor (AAA10F) | 1 | cross-check of energy measurements with a second instrument |
| B15 | Keysight N6705C DC Power Analyzer with N6781A and N6782A SMU modules and PathWave PW9252A | 1 | reference energy measurement with laboratory accuracy |
| B16 | Digilent Analog Discovery Pro ADP3450 with BNC probes (471-040) | 1 | multi-channel analogue loopback and signal analysis (FUSION) |
| B17 | Digilent Analog Discovery 3 (410-415) with BNC adapter and 2 P2150 probes | 1 | oscilloscope and signal generator for quick board tests |
| B18 | NI USB-6363 BNC (782258-01) with Euro power cord (763067-01) | 1 | calibrated data set (MIF) and data-acquisition loop (FUSION) |
| B19 | Siglent SDS1104X-E oscilloscope with MSO option SDS-1000X-E-16LA and SLA1016 | 1 | independent timing and signal check with 16 logic channels |
| B20 | Raspberry Pi 5, 8 GB | 2 | latency, jitter and deadlines with a real-time kernel; logging host for the sensors |
| B21 | NVIDIA Jetson Orin Nano Super Developer Kit | 1 | latency, jitter and deadlines on an edge platform with GPU |
| B22 | Espressif ESP32-C3-DevKitM-1 | 2 | run time of the microcontroller path |
| B23 | Fanless industrial PC for real-time measurements (model to be agreed) | 1 | real-time behaviour on industrial target hardware |
| B24 | Fluke 287 logging multimeter (2740201) with FVF-SC2 | 1 | traceable reference measurement of voltage and current |

### Priority C: One development kit per supported platform family

Priority C tests whether results depend on the platform. The same SC-NeuroCore designs are synthesised and measured on one development kit per FPGA family (resources, timing, power), and the same tasks run on neuromorphic processors, edge-AI accelerators and microcontroller families. This shows where the designs transfer well and where they do not.

| No. | Item (manufacturer, order code) | Qty | Purpose |
|----|--------------------------------------|-----|------------------------------|
| C1 | AMD Kria KV260 Starter Kit (SK-KV260-G) with Basic Accessory Pack | 1 | target family Kria: resources, timing and power of the same designs |
| C2 | AMD Kria KR260 Robotics Starter Kit (SK-KR260-G) | 1 | target family Kria: resources, timing and power of the same designs |
| C3 | AMD ZCU104 Evaluation Kit (EK-U1-ZCU104-G) | 1 | target family Zynq UltraScale+ EV: resources, timing and power of the same designs |
| C4 | AMD KC705 Evaluation Kit (EK-K7-KC705-G), if available | 1 | target family Kintex-7: resources, timing and power of the same designs |
| C5 | AMD Versal AI Edge VEK280 Evaluation Kit | 1 | target family Versal AI Edge: resources, timing and power of the same designs |
| C6 | AMD Versal AI Core VCK190 Evaluation Kit (EK-VCK190-G) | 1 | target family Versal AI Core: resources, timing and power of the same designs |
| C7 | AMD Alveo U50 (A-U50-P00G-PQ-G) with programming cable | 1 | target family Alveo: resources, timing and power of the same designs |
| C8 | AMD Alveo U250 (A-U250-A64G-PQ-G) | 1 | data-centre FPGA; demonstration target in the fusion project |
| C9 | Altera Cyclone 10 LP Evaluation Kit (EK-10CL025U256) | 1 | target family Cyclone 10: resources, timing and power of the same designs |
| C10 | Altera Stratix 10 SX SoC Development Kit (DK-SOC-1SSX-H-D) | 1 | target family Stratix 10 SoC: resources, timing and power of the same designs |
| C11 | Altera Agilex 5 E-Series Development Kit (DK-A5E013BM16AEA) with USB-PD power supply | 1 | target family Agilex 5: resources, timing and power of the same designs |
| C12 | Lattice CrossLink-NX Evaluation Board (LIFCL-40-EVN) | 1 | target family Lattice Nexus: resources, timing and power of the same designs |
| C13 | Lattice CertusPro-NX Evaluation Board (LFCPNX-EVN) | 1 | target family Lattice Nexus: resources, timing and power of the same designs |
| C14 | Lattice Certus-NX Versa Evaluation Board (LFD2NX-VERSA-EVN) | 1 | target family Lattice Nexus: resources, timing and power of the same designs |
| C15 | Lattice Avant-E Evaluation Board (LAV-E70-EVN) | 1 | target family Lattice Avant: resources, timing and power of the same designs |
| C16 | Lattice ECP5 Evaluation Board (LFE5UM5G-85F-EVN) | 1 | target family Lattice ECP5: resources, timing and power of the same designs |
| C17 | Efinix Titanium Ti60F225C-DK and Trion T20F256C-DK | 1 each | target family Efinix: resources, timing and power of the same designs |
| C18 | Microchip PolarFire SoC Icicle Kit (MPFS-ICICLE-KIT) | 1 | target family PolarFire SoC: resources, timing and power of the same designs |
| C19 | Microchip PolarFire Splash Kit (MPF300-SPLASH-KIT) | 1 | target family PolarFire: resources, timing and power of the same designs |
| C20 | Microchip SmartFusion2 Security Evaluation Kit (M2S090TS-EVAL-KIT) | 1 | target family SmartFusion2: resources, timing and power of the same designs |
| C21 | QuickLogic QuickFeather Lite (QFL-S3BDEVKIT-AA-1.0) | 1 | target family QuickLogic EOS S3: resources, timing and power of the same designs |
| C22 | Sipeed Tang Nano 9K | 1 | target family Gowin: resources, timing and power of the same designs |
| C23 | BrainChip AKD1000 PCIe Board (BD-PCIE-AKD10) and AKD1500 M.2 (BD-PCIE-M215BM) | 1 each | spiking networks on neuromorphic hardware in comparison |
| C24 | SynSense Xylo Audio 3 and Xylo IMU Development Kits | 1 each | spiking networks on neuromorphic hardware in comparison |
| C25 | Hailo-8 M.2 module (HM218B1C2FAE) | 1 | the same task on an edge-AI accelerator |
| C26 | Raspberry Pi AI HAT+ 26 TOPS and AI HAT+ 2 | 1 each | the same task on edge-AI accelerators |
| C27 | NXP i.MX 93 EVK (MCIMX93-EVK) and FRDM-IMX93 | 1 each | the same task on Arm Ethos-U65 |
| C28 | Renesas RZ/V2H Evaluation Kit (RTK0EF0168C04000BJ) with 100 W USB-PD power supply | 1 | the same task on Renesas DRP-AI |
| C29 | Raspberry Pi AI Camera (Sony IMX500) | 1 | the same task with processing on the image sensor |
| C30 | Qualcomm RB3 Gen 2 Vision Kit (RB3G2-VK-EN) with heatsink and fan | 1 | the same task on Qualcomm Hexagon |
| C31 | Kneron KL730 Development Kit | 1 | the same task on an edge-AI accelerator |
| C32 | Raspberry Pi Pico 2 W (4), Pico W (2) and Debug Probe (1) | set | the same task on RP2350 and RP2040 |
| C33 | Espressif ESP32-S3-DevKitC-1-N8R8 (2) and -N32R16V (1) | set | the same task on ESP32-S3 |
| C34 | Nordic Semiconductor nRF5340 DK | 1 | the same task on nRF53 |
| C35 | Analog Devices MAX78000EVKIT# (1) and MAX78000FTHR# (2) | set | the same task on a microcontroller with hardware accelerator |

### Priority D: Accessories and consumables

Priority D contains the accessories without which the equipment of priorities A to C cannot be operated or set up reproducibly.

| No. | Item (manufacturer, order code) | Qty | Purpose |
|----|--------------------------------------|-----|------------------------------|
| D1 | microSD 32 GB, Class 10 / A1 | 10 | boot media for the boards |
| D2 | microSD 32 GB, UHS-1 / A2 | 4 | Red Pitaya and Raspberry Pi |
| D3 | NVMe-SSD M.2 2280, 1 TB | 1 | Jetson |
| D4 | Raspberry Pi 27 W USB-C power supply (EU) and Active Cooler | 2 each | Raspberry Pi 5 |
| D5 | Micro-HDMI to HDMI cable | 1 | Raspberry Pi 5 |
| D6 | 12 V / 3 A power supply, barrel plugs 2.1 mm and 2.5 mm, centre positive | 4 | FPGA boards |
| D7 | USB data cables 1 m: A–Micro-B, A–Mini-B, A–C, C–C (mixed) | 20 | all boards |
| D8 | Cat6 patch cables and gigabit switch, 8 ports | 10 + 1 | laboratory network |
| D9 | USB 3.0 hub, 7 ports, powered | 2 | measurement bench |
| D10 | Monitor with DisplayPort and HDMI, with cables | 1 | commissioning |
| D11 | 5 V fans and heatsinks for development boards | 4 | continuous operation during measurements |
| D12 | STEMMA QT cables, Dupont jumper kit, breadboards | 1 set | measurement set-ups |
| D13 | Type J (CH) power cords and EU → CH adapters | 10 | power supplies of the equipment |

### Priority E: Software licences

Priority E contains the licences without which no complete bitstreams can be generated for larger devices; without a bitstream there is no measurement on the board.

| No. | Item (manufacturer, order code) | Qty | Purpose |
|----|--------------------------------------|-----|------------------------------|
| E1 | AMD Vivado Core, node-locked licence | 1 | bitstreams for ZU9EG and KU040 beyond the kit licences |
| E2 | AMD Vivado Pro, node-locked licence | 1 | bitstreams for Versal |
| E3 | Altera Quartus Prime Pro | 1 | bitstreams for Stratix 10 and Agilex |
| E4 | Lattice Radiant Subscription (LSC-SW-RADIANT-NL) | 1 | complete bitstreams for CertusPro-NX and Avant |
| E5 | Lattice Diamond Subscription (LSC-SW-NL) | 1 | bitstreams for ECP5-5G |
| E6 | Hailo Dataflow Compiler (access) | 1 | model compilation for Hailo |

### Priority F: After the first laboratory results

Priority F follows only when the laboratory loop delivers clean results: a professional real-time test system on which the control is verified under conditions close to later use.

| No. | Item (manufacturer, order code) | Qty | Purpose |
|----|--------------------------------------|-----|------------------------------|
| F1 | Professional real-time test system (OPAL-RT, Speedgoat or NI CompactRIO/PXI), quotation | 1 | hardware-in-the-loop after a clean laboratory loop |

### Priority G: Compute and laboratory infrastructure

Priority G provides the compute on which the ongoing research runs: training and evaluation of the models, baseline models, isolated GPU latency measurements and the measurement of energy per solved task, plus power supply, rack, network and data storage for safe operation. Each item is usable on its own.

| No. | Item (manufacturer, order code) | Qty | Purpose |
|----|--------------------------------------|-----|------------------------------|
| G1 | Server with four GPUs: AMD EPYC 9555, 768 GB DDR5 ECC, 4 × NVIDIA RTX PRO 6000 Blackwell Server Edition 96 GB, 25/100 GbE (e.g. Thomas-Krenn RA1208-GIEPG); equivalent AMD Instinct configuration welcome | 2 | training and evaluation of large models, parallel parameter studies and baseline models |
| G2 | GPU workstation: AMD Threadripper PRO 9955WX, 128 GB DDR5 ECC, NVIDIA RTX PRO 6000 Blackwell Max-Q 96 GB (e.g. Lenovo ThinkStation P8) | 1 | model development, plus isolated CPU and GPU latency measurements |
| G3 | Metered compute node: AMD Threadripper PRO 9965WX, 256 GB DDR5 ECC, 2 × NVIDIA RTX PRO 6000 Blackwell Max-Q 96 GB, metered power strip and power-rail meters | 1 | reproducible measurement of energy per solved task below 1.5 kW |
| G4 | APC Smart-UPS On-Line SRT10KRMXLI (10 kVA) plus external battery pack SRT192RMBP2 | 1 + 1 | uninterrupted operation of servers and data storage |
| G5 | APC rack PDU AP8659EU3 (metering and switching per outlet) | 2 | energy metering per device, remote switching |
| G6 | Rack APC NetShelter SX AR3100 (42U); network MikroTik CRS518-16XS-2XQ-RM (25/100 GbE) plus CSS326-24G-2S+RM (management) | 1 set | installation, networking, remote maintenance |
| G7 | Synology RackStation RS2423RP+ populated to 240 TB (12 × 20 TB), 25 GbE card E25G30-F2 | 1 | data sets, model checkpoints and measurement logs (about 200 TB usable) |
| G8 | Node with eight GPUs (NVIDIA HGX or DGX B200/B300, alternatively AMD Instinct MI355X), quotation | (1) | reference for large models; requires its own electrical and cooling work |
