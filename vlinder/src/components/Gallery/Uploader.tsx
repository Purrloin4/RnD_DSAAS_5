"use client";
import React, { useRef, useState } from "react";
import {Input } from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import Tus from "@uppy/tus";
import { useUser } from "@/utils/store/user";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Uploader() {
const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  
  const user = useUser((state) => state.user);

  const supabase = createClient();
  const router = useRouter();

  const [visible, setVisible] = useState(false);

  const onBeforeRequest = async (req: any) => {
    const { data } = await supabase.auth.getSession();
    req.setHeader("Authorization", `Bearer ${data.session?.access_token}`);
  };

  const [uppy] = useState(() =>
    new Uppy({
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: ["image/*"],
        maxFileSize: 5 * 1000 * 1000,
      },
    }).use(Tus, {
      endpoint:
        process.env.NEXT_PUBLIC_SUPABASE_URL +
        "/storage/v1/upload/resumable",
      onBeforeRequest,
      allowedMetaFields: [
        "bucketName",
        "objectName",
        "contentType",
        "cacheControl",
      ],
    })
  );

  uppy.on("file-added", (file) => {
    file.meta = {
      ...file.meta,
      bucketName: "images",
      contentType: file.type,
    };
  });

  uppy.on("upload-success", () => {
    uppy.cancelAll();
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setVisible(false);
    router.refresh();
  });

  const handleUpload = () => {
    if (uppy.getFiles().length !== 0) {
      const randomUUID = crypto.randomUUID();

      uppy.setFileMeta(uppy.getFiles()[0].id, {
        objectName:
          user?.id + "/" + randomUUID + "/" + uppy.getFiles()[0].name,
      });

      uppy.upload()
      .then(async () => {
        const description = inputRef.current.value;
        if (description.trim()) {
          const { error } = await supabase
            .from("posts")
            .update({ description: description })
            .eq("id", randomUUID);
          if (error) {
            toast.error("Fail to update descriptions.");
          }
        }
      });
    } else {
      toast.warning("Please add an image");
    }
  };

  return (
	<>
    <div>
	<Button onPress={onOpen}>Upload Image</Button>
	<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
	<ModalContent>
          {(onClose) => (
            <>
    <ModalHeader className="flex flex-col gap-1">Daily Upload</ModalHeader>

        <ModalBody>
          <Dashboard uppy={uppy} className="w-auto" hideUploadButton />
          <Input placeholder="Image description" ref={inputRef} />
        </ModalBody>
        <ModalFooter>
          
		  <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
          <Button onPress={handleUpload}>
            Upload
          </Button>
        </ModalFooter>
		</>
          )}
		          </ModalContent>

      </Modal>
    </div>
	</>
  );
}

// "use client";
// import React, { useRef, useState } from "react";
// import {
// 	Dialog,
// 	DialogContent,
// 	DialogDescription,
// 	DialogHeader,
// 	DialogTitle,
// 	DialogTrigger,
// } from "@/components/ui/dialog";

// import Uppy from "@uppy/core";
// import { Dashboard } from "@uppy/react";

// import "@uppy/core/dist/style.min.css";
// import "@uppy/dashboard/dist/style.min.css";
// import { Button } from "@nextui-org/react";
// import Tus from "@uppy/tus";
// import { useUser } from "@/utils/store/user";
// // import useUser from "@/app/hook/useUser";
// import { createClient } from "@/utils/supabase/client";
// // import { Input } from "./ui/input";
// import {Input} from "@nextui-org/input";

// import { toast } from "sonner";
// import { useRouter } from "next/navigation";

// export default function Uploader() {
// 	const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
// 	// const { data: user } = useUser();
//     const user = useUser((state) => state.user);

// 	const supabase = createClient();
// 	const router = useRouter();

// 	const onBeforeRequest = async (req: any) => {
// 		const { data } = await supabase.auth.getSession();
// 		req.setHeader("Authorization", `Bearer ${data.session?.access_token}`);
// 	};
// 	const [uppy] = useState(() =>
// 		new Uppy({
// 			restrictions: {
// 				maxNumberOfFiles: 1,
// 				allowedFileTypes: ["image/*"],
// 				maxFileSize: 5 * 1000 * 1000,
// 			},
// 		}).use(Tus, {
// 			endpoint:
// 				process.env.NEXT_PUBLIC_SUPABASE_URL +
// 				"/storage/v1/upload/resumable",
// 			onBeforeRequest,
// 			allowedMetaFields: [
// 				"bucketName",
// 				"objectName",
// 				"contentType",
// 				"cacheControl",
// 			],
// 		})
// 	);

// 	uppy.on("file-added", (file) => {
// 		file.meta = {
// 			...file.meta,
// 			bucketName: "images",
// 			contentType: file.type,
// 		};
// 	});

// 	uppy.on("upload-success", () => {
// 		uppy.cancelAll();
// 		if (inputRef.current) {
// 			inputRef.current.value = "";
// 		}
// 		document.getElementById("trigger-close")?.click();
// 		router.refresh();
// 	});

// 	const handleUpload = () => {
// 		if (uppy.getFiles().length !== 0) {
// 			const randomUUID = crypto.randomUUID();

// 			uppy.setFileMeta(uppy.getFiles()[0].id, {
// 				objectName:
// 					user?.id + "/" + randomUUID + "/" + uppy.getFiles()[0].name,
// 			});

// 			uppy.upload().then(async () => {
// 				const description = inputRef.current.value;
// 				if (description.trim()) {
// 					const { error } = await supabase
// 						.from("posts")
// 						.update({ description: description })
// 						.eq("id", randomUUID);
// 					if (error) {
// 						toast.error("Fail to update descriptions.");
// 					}
// 				}
// 			});
// 		} else {
// 			toast.warning("Please adding an image");
// 		}
// 	};

// 	return (
// 		<Dialog>
// 			<DialogTrigger asChild>
// 				<button id="upload-trigger"></button>
// 			</DialogTrigger>
// 			<DialogContent>
// 				<DialogHeader>
// 					<DialogTitle>Daily Upload</DialogTitle>
// 					<DialogDescription>Select your photo.</DialogDescription>
// 				</DialogHeader>
// 				<div className=" space-y-5">
// 					<Dashboard
// 						uppy={uppy}
// 						className="w-auto"
// 						hideUploadButton
// 					/>
// 					<Input placeholder=" image description" ref={inputRef} />
// 					<Button className="w-full" onClick={handleUpload}>
// 						Upload
// 					</Button>
// 				</div>
// 			</DialogContent>
// 		</Dialog>
// 	);
// }