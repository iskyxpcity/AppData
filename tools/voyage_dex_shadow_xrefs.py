#!/usr/bin/env python3
import os, struct, sys, glob

def uleb(data, off):
    result = shift = 0
    while True:
        b = data[off]; off += 1
        result |= (b & 0x7f) << shift
        if not (b & 0x80): return result, off
        shift += 7

def read_dex(path):
    data = open(path, "rb").read()
    if data[:4] != b"dex\\n": raise ValueError("not dex: " + path)
    def u32(o): return struct.unpack_from("<I", data, o)[0]
    str_size, str_off = u32(56), u32(60)
    type_size, type_off = u32(64), u32(68)
    meth_size, meth_off = u32(88), u32(92)
    class_size, class_off = u32(96), u32(100)
    strings = []
    for i in range(str_size):
        off = u32(str_off + i*4)
        _, off = uleb(data, off)
        end = data.find(b"\\0", off)
        strings.append(data[off:end].decode("utf-8", "replace"))
    types = [strings[u32(type_off+i*4)] for i in range(type_size)]
    methods = []
    for i in range(meth_size):
        cidx, pidx, nidx = struct.unpack_from("<HHI", data, meth_off+i*8)
        methods.append((types[cidx], strings[nidx]))
    field_size, field_off = u32(80), u32(84)
    fields = []
    for i in range(field_size):
        cidx, tidx, nidx = struct.unpack_from("<HHI", data, field_off+i*8)
        fields.append((types[cidx], types[tidx], strings[nidx]))
    # DEX instruction widths, in 16-bit code units.
    widths = [1]*256
    def setw(a,b,n):
        for op in range(a,b+1): widths[op]=n
    setw(0x02,0x03,2); setw(0x05,0x06,2); setw(0x08,0x09,2)
    setw(0x13,0x15,2); widths[0x14]=3; widths[0x17]=3; widths[0x18]=5
    widths[0x16]=2; widths[0x19]=2; widths[0x1a]=2; widths[0x1b]=3; widths[0x1c]=2
    widths[0x1f]=2; widths[0x20]=2; widths[0x22]=2; widths[0x23]=2
    widths[0x24]=3; widths[0x25]=3; widths[0x26]=3
    widths[0x29]=2; widths[0x2a]=3; widths[0x2b]=3; widths[0x2c]=3
    setw(0x2d,0x3d,2); setw(0x44,0x6d,2)
    setw(0x6e,0x72,3); setw(0x74,0x78,3)
    setw(0x90,0xaf,2); setw(0xd0,0xe2,2)
    widths[0xfa]=4; widths[0xfb]=4; widths[0xfc]=3; widths[0xfd]=3
    widths[0xfe]=2; widths[0xff]=2
    targets = {
      ("Ldefpackage/dko;", "Io"),
      ("Ldefpackage/dko;", "oo"),
      ("Ldefpackage/dko;", "llO"),
      ("Ldefpackage/dko;", "loO"),
      ("Ldefpackage/bko;", "<init>"),
      ("Ldefpackage/bko;", "l"),
      ("Ldefpackage/wgo0;", "<init>"),
    }
    out=[]
    for ci in range(class_size):
        base=class_off+ci*32
        cidx= u32(base)
        owner=types[cidx]
        cdata=u32(base+24)
        if not cdata: continue
        p=cdata
        sf,p=uleb(data,p); inf,p=uleb(data,p); dm,p=uleb(data,p); vm,p=uleb(data,p)
        for _ in range(sf+inf):
            _,p=uleb(data,p); _,p=uleb(data,p)
        for count in (dm,vm):
            mid=0
            for _ in range(count):
                diff,p=uleb(data,p); acc,p=uleb(data,p); code,p=uleb(data,p)
                mid += diff
                if not code: continue
                regs,ins,outs,tries,dbg,insns = struct.unpack_from("<HHHHII",data,code)
                start=code+16; pc=0
                while pc < insns:
                    op=struct.unpack_from("<H",data,start+pc*2)[0]
                    opcode=op & 0xff
                    if opcode==0 and (op>>8) in (1,2,3):
                        ident=op>>8
                        if ident==1:
                            sz=struct.unpack_from("<H",data,start+(pc+1)*2)[0]; length=4+sz*2
                        elif ident==2:
                            sz=struct.unpack_from("<H",data,start+(pc+1)*2)[0]; length=2+sz*4
                        else:
                            ew=struct.unpack_from("<H",data,start+(pc+1)*2)[0]
                            sz=struct.unpack_from("<I",data,start+(pc+2)*2)[0]
                            length=4+(sz*ew+1)//2
                        pc += length; continue
                    length=widths[opcode]
                    if opcode in list(range(0x6e,0x73))+list(range(0x74,0x79)):
                        ref=struct.unpack_from("<H",data,start+(pc+1)*2)[0]
                        if ref < len(methods) and methods[ref] in targets:
                            out.append(f"{os.path.basename(path)}: {owner} method_idx={mid} invokes {methods[ref][0]}->{methods[ref][1]} at code_unit={pc}")
                    # sget/sput variants: include direct static field access to Voyage's shared wave shape.
                    if opcode in (0x60,0x61,0x62,0x63,0x67,0x68,0x69,0x6a,0x6b,0x6c,0x6d):
                        ref=struct.unpack_from("<H",data,start+(pc+1)*2)[0]
                        if ref < len(fields) and fields[ref][0]=="Ldefpackage/vk7;" and fields[ref][2]=="lI":
                            out.append(f"{os.path.basename(path)}: {owner} method_idx={mid} accesses vk7.lI wave Shape at code_unit={pc}")
                    pc += max(1,length)
    return out

all_out=[]
for path in sys.argv[1:]:
    try: all_out.extend(read_dex(path))
    except Exception as e: all_out.append(f"ERROR {path}: {type(e).__name__}: {e}")
print("\\n".join(all_out))
